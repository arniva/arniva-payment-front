FROM node:22-alpine3.20 AS builder

RUN mkdir /app

COPY . /app
#COPY ./.env.example /app/.env
WORKDIR /app
RUN apk add --no-cache tzdata
ENV TZ=Europe/Istanbul
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ENV PUBLIC_SERVER_DOMAIN="https://odeme.arniva.tr"
RUN export NODE_OPTIONS="--max-old-space-size=8192"
ENV GENERATE_SOURCEMAP false

RUN npm install && npm run build


FROM node:22-alpine3.20

RUN mkdir /app

COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/package-lock.json /app/
COPY --from=builder /app/static /app/static
COPY --from=builder /app/.npmrc /app/.npmrc
ENV PUBLIC_SERVER_DOMAIN="https://odeme.arniva.tr"

WORKDIR /app


RUN npm install --omit=dev


CMD ["node","build"]