import fetch from 'node-fetch';

import config from '../../../../../../server.config';

/**
 * download file from cdn
 * @param data file data to create
 * @returns cdn responce
 */
const downloadFile = async ({ CDNPath, media }) => {
  const response = await fetch(
    `https://${media ? config.BUNNYCDN_API_MEDIA : config.BUNNYCDN_API}/uploads/${CDNPath}`,
    {
      method: 'GET',
      headers: {
        AccessKey: media ? config.BUNNYCDN_API_MEDIA_KEY : config.BUNNYCDN_API_KEY,
      },
    },
  );
  return response.body;
};

export const DownloadHelper = {
  downloadFile,
};
