import semver from 'semver'
import chalk from 'chalk'

export default (a, b) => {
  a = semver(a)
  b = semver(b)

  let [aMain, bMain] = diff([a.major, a.minor, a.patch], [b.major, b.minor, b.patch])
  let [aPre, bPre] = diff(a.prerelease, b.prerelease)

  return [
    stitch(aMain, aPre),
    stitch(bMain, bPre),
  ]
}

const stitch = (main, prerelease) =>
  prerelease.length > 0 ? main + '-' + prerelease : main

const diff = (a, b) => {
  let from = []
  let to = []
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    let ai = a[i]
    let bi = b[i]
    if (ai !== bi) {
      if (ai !== undefined) {
        from.push(chalk.red(ai))
      }
      if (bi !== undefined) {
        to.push(chalk.green(bi))
      }
    } else {
      from.push(ai)
      to.push(bi)
    }
  }
  return [from.join('.'), to.join('.')]
}
