FROM mongo:latest

# Copy the database initialize script: 
# Contents of /docker-entrypoint-initdb.d are run on startup

ADD  docker-entrypoint-initdb.d/ /docker-entrypoint-initdb.d/
ADD  dataset/ dataset/
