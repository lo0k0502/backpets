# ProjectP
## Make sure to yarn install after each pull!!
```bash
git clone https://github.com/lo0k0502/ProjectP.git
```
```bash
cd client
yarn install
yarn start
```
```bash
cd server
yarn install
yarn start
```

## Node Module Error
Make sure to change the mongodb_1.ObjectID() inside the multer-gridfs-storage module's gridfs.js file into mongodb_1.ObjectId() to avoid error.
```bash
124         if (!hasId) {
125             previous.id = new mongodb_1.ObjectID();//Change into mongodb_1.ObjectId()
126         }
```
