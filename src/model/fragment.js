// Import necessary modules
const { randomUUID } = require('crypto');
const contentType = require('content-type');
const validateKey = (key) => typeof key === 'string';

// Import database functions
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

const supportedTypes = [
  'text/plain',
  'text/markdown',
  'text/html',
  'application/json',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
];

// Define the Fragment class
class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    // Set properties
    if (!(validateKey(ownerId) && validateKey(type))) {
      throw new Error('OwnerId and Type are required');
    }
    if (supportedTypes.includes(contentType.parse(type).type)) {
      this.type = type;
    } else {
      throw new Error(`content type is invalid`);
    }
    if (size >= 0 && typeof size == 'number') {
      this.size = size;
    } else {
      throw new Error();
    }
    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
  }

  static async byUser(ownerId, expand = false) {
    if (typeof ownerId !== 'string') {
      throw new Error(`ownerId must be a string`);
    }

    return listFragments(ownerId, expand);
  }

  static async byId(ownerId, id) {
    // Read fragment metadata from the database
    const fragmentMeta = await readFragment(ownerId, id);
    // Return new Fragment instance with retrieved metadata
    return new Fragment(fragmentMeta);
  }

  static async delete(ownerId, id) {
    // Delete fragment metadata and data from the database
    await deleteFragment(ownerId, id);
  }

  async save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  async getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  async setData(data) {
    if (!data) {
      throw new Error(`data is invalid`);
    }
    this.size = data.length;
    this.save();
    return writeFragmentData(this.ownerId, this.id, data);
  }
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  get isText() {
    return this.mimeType.startsWith('text/');
  }

  static isSupportedType(value) {
    return supportedTypes.includes(contentType.parse(value).type);
  }
}

// Export the Fragment class
module.exports.Fragment = Fragment;
