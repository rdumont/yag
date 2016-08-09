import chalk from 'chalk'
import childProcess from 'child_process'

export default (command) => {
  console.log(`$ ${chalk.cyan(command)}`)
  childProcess.execSync(command, {stdio: 'inherit'})
}
