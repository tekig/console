#!/usr/bin/env bash
# Copyright (C) 2022, MinIO, Inc.
#
# This code is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License, version 3,
# as published by the Free Software Foundation.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License, version 3,
# along with this program.  If not, see <http://www.gnu.org/licenses/>

# This script requires: kubectl, kind

SCRIPT_DIR=$(dirname "$0")
export SCRIPT_DIR

source "${SCRIPT_DIR}/common.sh"



function install_tenant() {
    echo "Installing lite tenant"

	try kubectl apply -k "${SCRIPT_DIR}/../../portal-ui/tests/scripts/tenant"

    echo "Waiting for the tenant statefulset, this indicates the tenant is being fulfilled"
    waitdone=0
    totalwait=0
    while true; do
	waitdone=$(kubectl -n tenant-lite get pods -l v1.min.io/tenant=storage-lite --no-headers | wc -l)
	if [ "$waitdone" -ne 0 ]; then
	    echo "Found $waitdone pods"
	    break
	fi
	sleep 5
	totalwait=$((totalwait + 5))
	if [ "$totalwait" -gt 300 ]; then
	    echo "Tenant never created statefulset after 5 minutes"
	    try false
	fi
    done

    echo "Waiting for tenant pods to come online (5m timeout)"
    try kubectl wait --namespace tenant-lite \
	--for=condition=ready pod \
	--selector="v1.min.io/tenant=storage-lite" \
	--timeout=300s

    echo "Build passes basic tenant creation"
}


function main() {
    destroy_kind

    setup_kind

    install_operator

    install_tenant

    check_tenant_status tenant-lite storage-lite

    kubectl -n minio-operator port-forward svc/console 9090 &
}

main "$@"
