VERSION=$1;

# Build backend
echo "Building backend....."
cd ./server && sh build.sh
cd ../

# Build frontend
echo "Building frontend....."
cd ./web && sh build.sh
cd ../


sudo docker build -t webrtc-app:$VERSION . --platform linux/amd64;

docker run -p 7000:8000  webrtc-app:$VERSION;