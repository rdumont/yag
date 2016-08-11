#!/usr/bin/env node
import yargs from 'yargs'
import chalk from 'chalk'
import release from './release'
import pkg from '../package.json'

const args = yargs.argv

if (args.h || args.help) {
  console.log(`YAG v${pkg.version}

${chalk.bold('Usage')}
  $ yag [<${chalk.yellow('type')}>] [${chalk.green('options...')}]

${chalk.bold('Types')}
  ${chalk.yellow('major')}     Increments the major component (${chalk.cyan(1)}.x.y -> ${chalk.cyan(2)}.0.0)
  ${chalk.yellow('minor')}     Increments the minor component (x.${chalk.cyan(1)}.y -> x.${chalk.cyan(2)}.0)
  ${chalk.yellow('patch')}     Increments the minor component (x.y.${chalk.cyan(1)} -> x.y.${chalk.cyan(2)})
  ${chalk.yellow('pre')}       Increments the pre-release component (x.y.z-${chalk.cyan('beta.1')} -> x.y.z-${chalk.cyan('beta.2')})
  ${chalk.yellow('promote')}   Removes the pre-release component (x.y.z${chalk.cyan('-beta')} -> x.y.z)

${chalk.bold('Options')}
  -${chalk.green('h')} --${chalk.green('help')}     Show this screen
  -${chalk.green('v')} --${chalk.green('version')}  Show version
  -${chalk.green('s')} --${chalk.green('stable')}   Bump directly to stable version, skipping pre-release
  -${chalk.green('t')} --${chalk.green('tag')}      The pre-release tag name (default: beta)
  -${chalk.green('y')}            Do not ask for confirmation at each step

`)
} else if (args.v || args.version) {
  console.log(`YAG v${pkg.version}\n`)
} else {
  release(args._[0], {
    stable: args.s || args.stable,
    tag: args.t || args.tag,
    unattended: args.y,
  })
}
