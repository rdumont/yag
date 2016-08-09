import semver from 'semver'

const types = {
  major: 'major',
  minor: 'minor',
  patch: 'patch',
  pre: 'pre',
  promote: 'promote',
}

export default (current, type, options) => {
  options = options || {}
  let isPreRelease = current.indexOf('-') > 0

  if (!isPreRelease && type === types.pre) {
    throw new Error('Cannot bump pre-release while stable')
  }

  if (type === types.promote) {
    if (!isPreRelease) {
      throw new Error('Cannot promote already stable version')
    }
    return current.replace(/\-.+/, '')
  }

  let increment = figureIncrement(isPreRelease, type, options.stable)
  let newVersion = semver.inc(current, increment)
  return fixPreReleaseIdentifier(newVersion, options.tag)
}

const figureIncrement = (isPreRelease, type, toStable) => {
  if (isPreRelease && !toStable) {
    switch (type) {
      case types.major: return 'premajor'
      case types.minor: return 'preminor'
      case types.patch: return 'prepatch'
      default: return 'prerelease'
    }
  } else if (!toStable) {
    switch (type) {
      case types.major: return 'premajor'
      case types.minor: return 'preminor'
      default: return 'prepatch'
    }
  } else {
    switch (type) {
      case types.major: return 'major'
      case types.minor: return 'minor'
      default: return 'patch'
    }
  }
}

const fixPreReleaseIdentifier = (version, tag) => {
  if (tag) {
    if (/\-\w+/.test(version)) {
      version = version.replace(/\-.+/, `-${tag}`)
    } else {
      version = version + `-${tag}`
    }
  }

  return version.replace(/\-0$/, `-${tag || 'beta'}`)
}
