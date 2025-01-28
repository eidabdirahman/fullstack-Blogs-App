import cloudinary from 'cloudinary';
import { CLOUDINARY_API_kEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from './Config.js';

cloudinary.v2.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_kEY,
    api_secret: CLOUDINARY_API_SECRET,

});

export default cloudinary.v2;