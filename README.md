# LostMeadow

# Prerequisites:
Docker and TensorFlow Serving along with Python 3.7 must be installed to run locally

# File structure:
Standard Flask template structure
The saved model is in /src/saved_model and the training data is in /flowers folder
The model must be used to make a TensorFlow serving container with before the REST API can be called from the main 

# Start a TensorFlow Serving Container
To make the docker container run the following command where the source= is the containing folder of the saved_model
docker run -p 8501:8501 --name=tf_serving --mount type=bind,source=yoursourcefolder -e  MODEL_NAME=your_model -t tensorflow/serving

Once the container is created and running the application can be run by navigating to the src container and running 'python app.py' in a terminal and then navigate to localhost:5000 in browser
