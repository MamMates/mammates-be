import { v4 as uuidv4 } from 'uuid';

const createFilename = (prefix, originalFilename) => {
  const nameStructure = originalFilename.split('.');
  const newName = `${prefix}${uuidv4()}.${nameStructure[nameStructure.length - 1]}`;
  return newName;
};

export default createFilename;
