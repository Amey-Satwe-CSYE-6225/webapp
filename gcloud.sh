IMAGE_NAME=$(cat packer_image_name.txt)
echo $IMAGE_NAME
gcloud secrets versions access 1 --secret=webapp_secret --out-file=secret.json

STARTUP_SCRIPT=$(cat ./secret.json | python3 -c "import sys, json; print(json.load(sys.stdin)['metadata_startup_script'])")

echo $STARTUP_SCRIPT > ./startup_script.sh


ts=$(date +%Y%m%d%H%M)

gcloud compute instance-templates create webapp-from-git-$ts --instance-template-region="us-east1" --tags="webapp" --machine-type="n2-standard-2" --region="us-east1" --network-interface=network="cloud-demo-vpc",no-address,subnet="webapp" --service-account=csye-demo-service-account@csye-6225-demo-413900.iam.gserviceaccount.com --scopes=https://www.googleapis.com/auth/cloud-platform --tags=load-balanced-backend,csye-6225 --maintenance-policy="MIGRATE" --image-project="csye-6225-demo-413900" --image=$IMAGE_NAME --boot-disk-type="pd-standard" --boot-disk-kms-key=projects/csye-6225-demo-413900/locations/us-east1/keyRings/keyringexamplengiv/cryptoKeys/cryptokeyexamplengiv --metadata-from-file="./startup_script.sh"

gcloud compute instance-groups managed rolling-action start-update webapp-manager --version="template=projects/csye-6225-demo-413900/regions/us-east1/instanceTemplates/webapp-from-git-$ts" --region="us-east1"

gcloud compute instance-groups managed wait-until webapp-manager \
    --version-target-reached --region="us-east1"
