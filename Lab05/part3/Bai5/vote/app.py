from flask import Flask, request, redirect, render_template_string
import os
import redis

app = Flask(__name__)
r = redis.Redis(host=os.environ.get('REDIS_HOST', 'redis'), port=6379, decode_responses=True)

PAGE = """
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Voting App</title>
  </head>
  <body>
    <h1>Vote for your favorite option</h1>
    <form method="post" action="/vote">
      <button name="option" value="cats" type="submit">Cats</button>
      <button name="option" value="dogs" type="submit">Dogs</button>
    </form>
    <p><a href="/result">View results</a></p>
  </body>
</html>
"""

@app.get('/')
def index():
    return render_template_string(PAGE)

@app.post('/vote')
def vote():
    option = request.form.get('option')
    if option in ('cats', 'dogs'):
        r.hincrby('votes', option, 1)
    return redirect('/')

@app.get('/result')
def result():
    return redirect(os.environ.get('RESULT_URL', 'http://result:5001'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
