import tensorflow as tf
import numpy as np
import io
import json
import random
from tensorflow.keras.preprocessing import sequence
from tensorflow.python.keras.layers import embeddings
from tensorflow.keras.layers import Embedding, Dropout, GlobalAveragePooling1D, Conv1D, LSTM, Dense, Bidirectional
from tensorflow.keras.models import Sequential
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from csv import reader

from tensorflow.python.keras.layers.pooling import MaxPooling1D

training_sentences = []
training_labels = []

testing_sentences = []
testing_labels = []

with open('words.csv', 'r') as read_obj:
    csv_reader = reader(read_obj)

    # Iterate over each row after the header in the csv
    for row in csv_reader:
        # row variable is a list that represents a row in csv
        training_sentences.append(row[0])
        training_labels.append(int(row[1]))

with open('validate.csv', 'r') as read_obj:
    csv_reader = reader(read_obj)

    # Iterate over each row after the header in the csv
    for row in csv_reader:
        #row variable is a list that represents a row in csv
        testing_sentences.append(row[0])
        testing_labels.append(int(row[1]))

#testing_sentences = ["lynch","fuck", "jason", "mary","katie", "will", "shitter", "susan", "holeass", "peanut", "bitchass", "piefuck", "kate", "bryan", "mason", "dick", "pube", "matt", "candace","ballsinherface","penis","buttwad","seymourbutts","rondabutts"]
#testing_labels = [0,1,0,0,0,0,0,0,1,0,1,1,0,0,0,1,1,0,0,1,1,1,1,0]

testing_labels_final = np.array(testing_labels)
training_labels_final = np.array(training_labels)

print(len(training_sentences))
print(len(testing_sentences))

num_chars = 52
embedding_dim = 256
max_length = 50
trunc_type = 'post'

tokenizer = Tokenizer(num_words=num_chars, char_level=True, oov_token='-')
tokenizer.fit_on_texts(training_sentences)
word_index = tokenizer.word_index
sequences = tokenizer.texts_to_sequences(training_sentences)
padded = pad_sequences(sequences, maxlen=max_length,truncating=trunc_type)

print("words:" + str(len(word_index)))

testing_sequences = tokenizer.texts_to_sequences(testing_sentences)
testing_padded = pad_sequences(testing_sequences, maxlen=max_length)

neg, pos = np.bincount(training_labels)
initial_bias = tf.keras.initializers.Constant(np.log([pos/neg]))

print(str(pos) + ":" + str(neg))

model = Sequential()
model.add(Embedding(num_chars, embedding_dim, input_length=max_length))
model.add(Conv1D(filters=512, kernel_size=5, padding='same', activation='relu'))
model.add(Bidirectional(LSTM(512, return_sequences=True)))
model.add(Bidirectional(LSTM(256, return_sequences=True)))
#model.add(Bidirectional(LSTM(512, return_sequences=True)))
model.add(Bidirectional(LSTM(128)))

model.add(Dense(64, activation='relu'))
model.add(Dense(1, activation='sigmoid', bias_initializer=initial_bias))

lr_schedule = tf.keras.optimizers.schedules.ExponentialDecay(
    initial_learning_rate=0.0001,
    decay_steps=100000,
    decay_rate=0.95)

adam = tf.keras.optimizers.Adam(learning_rate=lr_schedule)

model.compile(loss='binary_crossentropy', optimizer=adam, metrics=['accuracy'])

class KerasCallback(tf.keras.callbacks.Callback):
    
    def on_epoch_end(self, epoch, logs=None):
        acc = logs["val_accuracy"]
        print(acc)
        if(acc == 1):
            self.model.stop_training = True

num_epochs = 30
callback = KerasCallback()
model.fit(padded, training_labels_final, epochs=num_epochs, validation_data=(testing_padded, testing_labels_final), callbacks=[callback])

e = model.layers[0]
weights = e.get_weights()[0]

predictions = model.predict(testing_padded)

threshold = 0.5
for i in range(len(predictions)):
    p = predictions[i]
    t = testing_sentences[i]
    print(p * 100)

    if p <= threshold:
        print(t + " - not profane")
    else:
        print(t + " - profane")


#tf2onnx.convert.from_keras(model, opset=13, output_path="model.onnx")
#onnxmltools.utils.save_model(onnx_model, 'example.onnx')
model.save('build/profanity_model', save_traces=False)

tokenizer_json = tokenizer.to_json()
with io.open('build/tokenizer.json', 'w', encoding='utf-8') as f:
    f.write(json.dumps(tokenizer_json, ensure_ascii=False))