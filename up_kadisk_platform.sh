#!/bin/bash
set -euo pipefail

function check_env() {
    : "${KADISK_CORP_REPO__NAMESPACE:?Variável KADISK_CORP_REPO__NAMESPACE não definida}"
    : "${TEMP_DIR:?Variável TEMP_DIR não definida}"
    : "${WORMS_SOLUTIONS__NAMESPACE:?Variável WORMS_SOLUTIONS__NAMESPACE não definida}"
}

function create_network() {
    local network_name="$1"
    if ! docker network inspect "$network_name" >/dev/null 2>&1; then
        echo "Criando rede '$network_name'..."
        docker network create "$network_name"
    else
        echo "Rede '$network_name' já existe."
    fi
}

function build_image() {
    local dockerfile="$1"
    local context="$2"
    local image_tag="$3"
    shift 3
    local build_args=("$@")
    echo "Construindo imagem '$image_tag' com Dockerfile '$dockerfile'..."
    docker build -f "$dockerfile" -t "$image_tag" "${build_args[@]}" "$context"
}

function run_container() {
    local project_name="$1"
    local service="$2"
    local image_tag="$3"
    local cmd="$4"
    local extra_opts="${5:-}"

    local container_name="${project_name}_${service}"
    echo "Executando container '$container_name'..."
    docker run -d \
        --name "$container_name" \
        --hostname "$service" \
        --network "${project_name}_default" \
        --network-alias "$service" \
        --label "com.docker.compose.project=${project_name}" \
        --label "com.docker.compose.service=${service}" \
        --label "com.docker.compose.container-number=1" \
        ${extra_opts} \
        "$image_tag" $cmd
}

function deploy_service() {
    local project_name="$1"
    local service="$2"
    local dockerfile="$3"
    local context="$4"
    local image_tag="$5"
    local command="$6"
    shift 6
    local build_args=("$@")

    build_image "$dockerfile" "$context" "$image_tag" "${build_args[@]}"
    run_container "$project_name" "$service" "$image_tag" "$command"
}

function main() {
    check_env

    local project_name="kadisk_project"
    local network_name="${project_name}_default"
    create_network "$network_name"

    deploy_service "$project_name" "standard-ecosystem-base-image" \
        "./dockerfiles/Dockerfile.base" "." \
        "standard-ecosystem-base-image:latest" "" 

    deploy_service "$project_name" "virtual-desk" \
        "./dockerfiles/Dockerfile.repository" "." \
        "virtual-desk:latest" "virtual-desk" \
        --build-arg REPOSITORY_NAMESPACE="${KADISK_CORP_REPO__NAMESPACE}" \
        --build-arg REPOSITORY_PATH="${TEMP_DIR}/${KADISK_CORP_REPO__NAMESPACE}" \
        --build-arg EXECUTABLE_FOR_INSTALL=virtual-desk

    deploy_service "$project_name" "kadisk-com" \
        "./dockerfiles/Dockerfile.repository" "." \
        "kadisk-com:latest" "kadisk-com" \
        --build-arg REPOSITORY_NAMESPACE="${KADISK_CORP_REPO__NAMESPACE}" \
        --build-arg REPOSITORY_PATH="${TEMP_DIR}/${KADISK_CORP_REPO__NAMESPACE}" \
        --build-arg EXECUTABLE_FOR_INSTALL=kadisk-com

    deploy_service "$project_name" "worms-solutions" \
        "./dockerfiles/Dockerfile.repository" "." \
        "worms-solutions:latest" "worms-website" \
        --build-arg REPOSITORY_NAMESPACE="${WORMS_SOLUTIONS__NAMESPACE}" \
        --build-arg REPOSITORY_PATH="${TEMP_DIR}/${WORMS_SOLUTIONS__NAMESPACE}" \
        --build-arg EXECUTABLE_FOR_INSTALL=worms-website

    build_image "./dockerfiles/Dockerfile.repository" "." "domain-router-proxy:latest" \
        --build-arg REPOSITORY_NAMESPACE="${KADISK_CORP_REPO__NAMESPACE}" \
        --build-arg REPOSITORY_PATH="${TEMP_DIR}/${KADISK_CORP_REPO__NAMESPACE}" \
        --build-arg EXECUTABLE_FOR_INSTALL=kadisk-domain-router-proxy
    run_container "$project_name" "domain-router-proxy" \
        "domain-router-proxy:latest" "kadisk-domain-router-proxy" "-p 8000:8080"

    echo "Deployment concluído na rede '$network_name'."
}

main
