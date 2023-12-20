FROM node:18-alpine

RUN apk add --update python3 py3-pip \
    && pip3 install --upgrade pip \
    && pip3 install -U platformio

COPY . /usr/src/app/

WORKDIR /usr/src/app

#RUN cd webdev && npm install

EXPOSE 5173

CMD sh -c "cd webdev && npm run dev"
