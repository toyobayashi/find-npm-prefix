'use strict'
// try to find the most reasonable prefix to use

const fs = require('fs')
const path = require('path')

function findPrefix (dir) {
  return new Promise((resolve) => {
    dir = path.resolve(dir)

    // this is a weird special case where an infinite recurse of
    // node_modules folders resolves to the level that contains the
    // very first node_modules folder
    let walkedUp = false
    while (path.basename(dir) === 'node_modules') {
      dir = path.dirname(dir)
      walkedUp = true
    }
    if (walkedUp) {
      resolve(dir)
    } else {
      resolve(findPrefix_(dir))
    }
  })
}

function findPrefix_ (dir, original) {
  if (!original) original = dir

  const parent = path.dirname(dir)
  // this is a platform independent way of checking if we're in the root
  // directory
  if (parent === dir) return Promise.resolve(original)

  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        // an error right away is a bad sign.
        // unless the prefix was simply a non
        // existent directory.
        if (err && dir === original && err.code !== 'ENOENT') {
          reject(err)
        } else {
          resolve(original)
        }
      } else if (files.indexOf('node_modules') !== -1 ||
                 files.indexOf('package.json') !== -1) {
        resolve(dir)
      } else {
        resolve(findPrefix_(parent, original))
      }
    })
  })
}

function findPrefixSync (dir) {
  dir = path.resolve(dir)

  // this is a weird special case where an infinite recurse of
  // node_modules folders resolves to the level that contains the
  // very first node_modules folder
  let walkedUp = false
  while (path.basename(dir) === 'node_modules') {
    dir = path.dirname(dir)
    walkedUp = true
  }
  if (walkedUp) {
    return dir
  }

  return findPrefixSync_(dir)
}

function findPrefixSync_ (dir, original = dir) {
  const parent = path.dirname(dir)
  if (parent === dir) return original

  let files
  try {
    files = fs.readdirSync(dir)
  } catch (err) {
    if (dir === original && err.code !== 'ENOENT') {
      throw err
    } else {
      return original
    }
  }

  if (files.indexOf('node_modules') !== -1 || files.indexOf('package.json') !== -1) {
    return dir
  }

  return findPrefixSync_(parent, original)
}

exports.findPrefix = findPrefix
exports.findPrefixSync = findPrefixSync
