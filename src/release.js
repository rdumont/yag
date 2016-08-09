import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import readline from 'readline-sync'
import bump from './bump'
import diff from './diff'
import exec from './exec'
import log from './logger'

const confirm = (question, options) => {
  if (options.unattended) {
    log.info(question + '[y/n]: y')
    return true
  }
  process.stdout.write(chalk.green('yag') + ': ')
  return !readline.keyInYN(question)
}

export default (type, options) => {
  let packagePath = findPackageJson()
  let oldPackageFile = fs.readFileSync(packagePath, 'utf8')
  let pkg = JSON.parse(oldPackageFile)
  let currentVersion = pkg.version
  let newVersion = bump(currentVersion, type, options)
  let [from, to] = diff(currentVersion, newVersion)
  log.info(`Bumping from ${chalk.gray(from)} to ${chalk.gray(to)}`)

  if (confirm('Patch package.json file?', options)) {
    log.info('Aborting...')
    return 0
  }

  log.info(`Patching ${chalk.cyan('package.json')} with version ${chalk.cyan(newVersion)}`)
  pkg.version = newVersion
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2))

  if (confirm('Commit changes and apply tag?', options)) {
    log.info('Aborting...')
    fs.writeFileSync(packagePath, oldPackageFile)
    return 0
  }

  let tagName = 'v' + newVersion

  exec(`git add ${path.relative('', packagePath)}`)
  exec(`git commit -m "Release ${tagName}"`)
  exec(`git tag ${tagName} -a -m "Release ${tagName}"`)

  if (confirm('Publish new tag?', options)) {
    log.info('Aborting...')
    exec('git reset HEAD~1 --mixed')
    exec(`git tag -d ${tagName}`)
    fs.writeFileSync(packagePath, oldPackageFile)
    return 0
  }

  exec(`git push origin master ${tagName}`)
}

const hightlight = chalk.yellow.inverse

const findPackageJson = () => {
  let currentPath = ''
  let lastChecked
  while (true) {
    let pathToCheck = path.resolve(currentPath, 'package.json')
    if (pathToCheck === lastChecked) {
      throw new Error('package.json file is inaccessible or doesn\'t exist')
    }
    lastChecked = pathToCheck

    try {
      fs.accessSync(pathToCheck, fs.R_OK | fs.W_OK)
      return pathToCheck
    } catch (err) {
      currentPath += '../'
    }
  }
}
