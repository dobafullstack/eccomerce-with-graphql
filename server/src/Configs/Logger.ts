import chalk from 'chalk';

export default class Logger {
    public static success(content: any): void {
        console.log(chalk.bgGreen(content));
    }
    public static error(content: any): void {
        console.log(chalk.bgRed(content));
    }
}
