import os, sys, random, json
from os import listdir
from os.path import isfile, join

import uvicorn

from starlette.responses import StreamingResponse
from fastapi.responses import FileResponse
from fastapi import APIRouter, status, HTTPException
from fastapi.staticfiles import StaticFiles

from fastapi import FastAPI



type_media = ["jpg", "png", "mp4", "webp"]
WEBUI_PORT = 8000
MEDIA_PATH = ""

app = FastAPI()
app.mount("/static", StaticFiles(directory="./public"), name="static")

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return FileResponse("./public/favicon_io/favicon.ico")

@app.get("/")
async def root():
    return {"message": "Hello World"}


def iter_file(path: str):
    with open(path, mode="rb") as file_like:
        yield from file_like

# should not be used
@app.get("/streaming-response/")
async def get_streaming_response() -> StreamingResponse:
    return StreamingResponse(
        iter_file(f"{MEDIA_PATH}/NOELreports_1280x720_1629134086450077696.mp4"),
        # media_type="audio/wave"
    )


@app.get("/file-response/")
async def get_file_response():
    return FileResponse(f"{MEDIA_PATH}/NOELreports_1280x720_1629134086450077696.mp4")

@app.get("/media/{filename}")
async def get_media_file(filename: str):
    if filename.split(".")[-1] in type_media:
        return FileResponse(f"{MEDIA_PATH}/{filename}")
    else:
        return None

@app.get("/json/{filename}")
async def get_json_file(filename: str):
    if filename.split(".")[-1] == "json":
        return FileResponse(f"{MEDIA_PATH}/{filename}")
    else:
        return None

@app.get("/get-media-list")
async def get_file_response():
    list_dir = listdir(MEDIA_PATH)
    only_medias = [f for f in list_dir if isfile(join(MEDIA_PATH, f)) and f.split(".")[-1] in type_media]
    only_jsons = [f for f in list_dir if isfile(join(MEDIA_PATH, f)) and f.split(".")[-1] == "json"]

    media_list = []
    for m in only_medias:
        entry = {}
        #
        entry["filename"] = m
        #
        temp_json = m.rsplit('.', maxsplit=1)[0] + ".info.json"
        if temp_json in only_jsons:
            with open(join(MEDIA_PATH, temp_json)) as f:
                try:
                    entry["embed_json_file"] = json.load(f)
                except Exception as e:
                    print(e)
        media_list.append(entry)

    return media_list




if __name__ == "__main__":
    cmd_options = ["path_to_data_directory", "port"]
    if len(sys.argv) != len(cmd_options)+1:
        print(f"{len(cmd_options)} command line params needed: {cmd_options}")
        exit(-1)
    MEDIA_PATH = os.path.abspath(sys.argv[1])
    WEBUI_PORT = int(sys.argv[2])
    print(MEDIA_PATH, WEBUI_PORT)
    #
    config = uvicorn.Config(app, port=WEBUI_PORT, log_level="info")
    server = uvicorn.Server(config)
    server.run()










