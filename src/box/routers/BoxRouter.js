import { flush } from '../../Helper';
import Presenter from '../../adaptors/PresenterAdaptor';
const {
  listFolders
} = Presenter;

import express from 'express';
const router = express.Router();

// maybe call get box ?
function getFolder(req, response) {
  flush({response, body: listFolders(), status: 200});
}

router.get('/boxes', getFolder);

export default router;
