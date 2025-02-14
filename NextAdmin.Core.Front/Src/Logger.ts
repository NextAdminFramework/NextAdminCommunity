namespace NextAdmin {

    export class Logger {

        events = new Array<LogEvent>();

        logError(message: string): Logger {
            this.events.push({
                type: LogEventType.Error,
                message: message,
                date: new Date()
            });
            return this;
        }

        logWarning(message: string): Logger {
            this.events.push({
                type: LogEventType.Warning,
                message: message,
                date: new Date()
            });
            return this;
        }

        logInfo(message: string): Logger {
            this.events.push({
                type: LogEventType.Info,
                message: message,
                date: new Date()
            });
            return this;
        }

        throwError(message: string) {
            throw (message);
        }

        buildTrace(): string {
            return this.events.select(e => '<b style="color="' + Logger.getEventTypeColor(e.type) + '">' + e.date.toLocaleDateString() + ' ' + e.date.toLocaleTimeString() + '</b>:' + e.message).join('<br />');
        }

        static getEventTypeColor(eventType: LogEventType): string {
            switch (eventType) {
                case LogEventType.Info:
                    return "#00aeff";
                case LogEventType.Warning:
                    return "#ffa200";
                case LogEventType.Error:
                    return "#ff0000";
                default:
                    return "#000000";
            }
        }

    }



    export interface LogEvent {

        date: Date;

        message: string;

        type: LogEventType;

    }

    export enum LogEventType {
        Info = 0,
        Warning = 1,
        Error = 2,
    }



}