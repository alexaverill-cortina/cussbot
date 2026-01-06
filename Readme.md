# Cussbot

This is a machine learning driven python service that calculates the "offsensiveness" of a first and last name

## Running

To run this service build the dockerfile in the server folder and then run the container

By default the container is listening on port 3333 that can be overridden by setting the  FLASK_RUN_PORT

## Training

To add to the model you will need to add positive and negative samples in the trainer/words.csv
Then use the env/scripts/activate to start the virtualenv, finally run profanity.py to retrain a new model.

The new model will be output into the build folder, and you can then copy that into the profanity_model folder in the server folder
