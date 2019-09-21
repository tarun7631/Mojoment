FROM node:10.16

ARG NODE_ENV=development1
ENV NODE_ENV=${NODE_ENV}

USER root

RUN useradd -d /home/ubuntu -m ubuntu \
	&& mkdir -p /home/ubuntu/rentomojo

WORKDIR /home/ubuntu/rentomojo

COPY package*.json ./

RUN npm audit fix && \
	npm install && \
    npm install nodemon -g

COPY . /home/ubuntu/rentomojo

EXPOSE 3000 80

CMD [ "npm", "start" ]