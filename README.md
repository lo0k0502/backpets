# ProjectP
## Start Up
> Make sure to yarn install after each pull!!
```
git clone https://github.com/lo0k0502/ProjectP.git
```
```
cd client
yarn install
yarn start
```
```
cd server
yarn install
yarn start
```

## Localhost Setting
Make sure to change your ip in both client and server's ``.env`` file!!```
BASE_URL=Your_IP
```


## Node Module Error
Make sure to change the mongodb_1.ObjectID() inside the multer-gridfs-storage module's gridfs.js file into mongodb_1.ObjectId() to avoid error.
```
124         if (!hasId) {
125             previous.id = new mongodb_1.ObjectID();//Change into mongodb_1.ObjectId()
126         }
```
