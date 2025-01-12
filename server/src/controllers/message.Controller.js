import { tryCatch } from '../utils/index.js';
import { getServiceObject } from '../db/serviceObjects.js';

export const messageObject = getServiceObject('messages');

const getMessages = tryCatch('get messages', async (req, res, next) => {});

const sendMessage = tryCatch('send message', async (req, res, next) => {});

const deleteMessage = tryCatch('delete message', async (req, res, next) => {});

const editMessage = tryCatch('edit message', async (req, res, next) => {});

export { getMessages, sendMessage, deleteMessage, editMessage };
