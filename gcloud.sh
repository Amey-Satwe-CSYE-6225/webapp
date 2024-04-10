IMAGE_NAME=$(cat packer_image_name.txt)
echo $IMAGE_NAME
gcloud secrets versions access 1 --secret=webapp_secret --out-file=secret.json

DATABASE=$(cat ./secret.json | python3 -c "import sys, json; print(json.load(sys.stdin)['DATABASE'])")
UNAME==$(cat ./secret.json | python3 -c "import sys, json; print(json.load(sys.stdin)['UNAME'])")
PASSWORD==$(cat ./secret.json | python3 -c "import sys, json; print(json.load(sys.stdin)['PASSWORD'])")
HOST==$(cat ./secret.json | python3 -c "import sys, json; print(json.load(sys.stdin)['HOST'])")


gcloud compute instance-templates create webapp-from-git --instance-template-region="us-east1" --tags="webapp" --machine-type="n2-standard-2" --region="us-east1" --network-interface=network="cloud-demo-vpc",subnet="webapp" --service-account=csye-demo-service-account@csye-6225-demo-413900.iam.gserviceaccount.com --scopes=https://www.googleapis.com/auth/cloud-platform --tags=load-balanced-backend,csye-6225 --maintenance-policy="MIGRATE" --image-project="csye-6225-demo-413900" --image=$IMAGE_NAME --boot-disk-type="pd-standard" --boot-disk-kms-key="projects/csye-6225-demo-413900/locations/us-east1/keyRings/keyringexamplemLzA/cryptoKeys/cryptokeyexamplemLzA"

gcloud compute instance-groups managed rolling-action start-update webapp-manager --version='template=projects/csye-6225-demo-413900/regions/us-east1/instanceTemplates/webapp-from-git' --region="us-east1"
