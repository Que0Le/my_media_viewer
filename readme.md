

## Install dev
```bash
python -m venv venv
.\venv\Scripts\activate # win
source venv/bin/activate # nix
python -m pip install fastapi "uvicorn[standard]"

python main.py ../view_tw_data 8000
# http://localhost:8000/static/sidebars/index.html
```

## Bootstrap
https://getbootstrap.com/docs/5.0/getting-started/download/