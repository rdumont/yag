import should from 'should'
import bump from '../src/bump'

const assertVersion = (current, expected, type, options) => {
  it(`${current} ${serializeArgs(type, options)}`, () => {
    let final = bump(current, type, options)
    final.should.equal(expected)
  })
}

const serializeArgs = (type, options) => {
  let result = []
  if (type) {
    result.push(type)
  }
  for (let key in options) {
    let prefix = key.length === 1 ? '-' : '--'
    if (typeof options[key] === 'boolean') {
      result.push(prefix + key)
    } else {
      result.push(`${prefix}${key} ${options[key]}`)
    }
  }
  return result.join(' ')
}

describe('bump', () => {
  describe('should increment stable to prerelease by default', () => {
    assertVersion('1.2.3', '1.2.4-beta')
    assertVersion('1.2.3', '1.2.4-beta', 'patch')
    assertVersion('1.2.3', '1.3.0-beta', 'minor')
    assertVersion('1.2.3', '2.0.0-beta', 'major')
  })

  describe('should increment prerelease versions', () => {
    assertVersion('1.2.3-beta.4', '1.2.3-beta.5')
    assertVersion('1.2.3-beta.4', '1.2.3-beta.5', 'pre')
    assertVersion('1.2.3-beta.4', '1.2.4-beta', 'patch')
    assertVersion('1.2.3-beta.4', '1.3.0-beta', 'minor')
    assertVersion('1.2.3-beta.4', '2.0.0-beta', 'major')
  })

  describe('should respect custom prerelease identifier', () => {
    assertVersion('1.2.3', '1.2.4-alpha', null, {tag: 'alpha'})
    assertVersion('1.2.3-beta.4', '1.2.3-alpha', null, {tag: 'alpha'})
  })

  describe('should create stable versions when explicitly said', () => {
    assertVersion('1.2.3', '1.3.0', 'minor', {stable: true})
    assertVersion('1.2.3-beta.4', '1.2.3', null, {stable: true})
    assertVersion('1.2.3-beta.4', '1.3.0', 'minor', {stable: true})
  })
})
