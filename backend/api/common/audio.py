import wave
import json
import io
from pydub import AudioSegment
from vosk import Model, KaldiRecognizer, SetLogLevel

SetLogLevel(0)

def convert_to_wav_mono_pcm(file_like):
    audio = AudioSegment.from_file(file_like)
    audio = audio.set_channels(1)
    audio = audio.set_frame_rate(16000)
    buffer = io.BytesIO()
    audio.export(buffer, format="wav", codec="pcm_s16le")
    buffer.seek(0)
    return buffer

def transcribe(file_like):
    if not file_like.name.lower().endswith('.wav'):
        buffer = convert_to_wav_mono_pcm(file_like)
        wf = wave.open(buffer, "rb")
    else:
        wf = wave.open(file_like, "rb")


    model = Model(model_name="vosk-model-small-en-us-0.15")

    rec = KaldiRecognizer(model, wf.getframerate())
    rec.SetWords(True)
    rec.SetPartialWords(True)

    text = ""

    while True:
        data = wf.readframes(4000)
        if len(data) == 0:
            break
        if rec.AcceptWaveform(data):
            res = json.loads(rec.Result())
            text += res["text"] + " "

    res = json.loads(rec.FinalResult())
    text += res["text"]

    print(text)
    return text