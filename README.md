# Dao hack ethglobal - Fakenews DAO

> Deployed [here](https://dao-hack.vercel.app) (work in progress).

Folder structure is self explanatory.

I'm not yet sure if backend is necessary, maybe we can just use on chain data + ipfs.

The frontend is copied from my other project, feel free to delete bloat. For css I use tailwind.

All files named with `.page.js` under `frontend/pages` will be treated as pages.
All files named with `.api.js` under `frontend/pages/api` will be treated as stateless api endpoints (like aws lambda).

Remember to `npm install`.

### TODOs

- Create lens profile for the proxy
- Create post proposals - Done
- Approve post proposals - Done
- Voting - Done

### Pages

- Landing page
- Choose modules / create dao page
- Post proposals page (one per dao)
- Screen per permissions module?
