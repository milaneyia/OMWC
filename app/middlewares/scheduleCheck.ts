import { ParameterizedContext } from 'koa';
import { Schedule } from '../models/Schedule';

async function getSchedule() {
    return await Schedule.findOne();
}

function hasApplicationsStarted(schedule: Schedule) {
    return (new Date() >= new Date(schedule.applicationsStartedAt));
}

function hasCaptainApplicationsEnded(schedule: Schedule) {
    return (schedule.captainApplicationsEndedAt && new Date() >= new Date(schedule.captainApplicationsEndedAt));
}

function hasMapperApplicationsEnded(schedule: Schedule) {
    return (schedule.mapperApplicationsEndedAt && new Date() >= new Date(schedule.mapperApplicationsEndedAt));
}

function hasJudgeApplicationsEnded(schedule: Schedule) {
    return (schedule.judgeApplicationsEndedAt && new Date() >= new Date(schedule.judgeApplicationsEndedAt));
}

export async function canApplicate(ctx: ParameterizedContext, next: () => Promise<any>) {
    const schedule = await getSchedule();

    if (!schedule) {
        return ctx.render('error');
    }

    const hasStarted = hasApplicationsStarted(schedule);

    let hasEnded: boolean|undefined = true;

    switch (ctx.state.applicationType) {
        case 'captain':
            hasEnded = hasCaptainApplicationsEnded(schedule);
            break;
        case 'mapper':
            hasEnded = hasMapperApplicationsEnded(schedule);
            break;
        case 'judge':
            hasEnded = hasJudgeApplicationsEnded(schedule);
            break;
    }

    const onGoing = (
        hasStarted &&
        !hasEnded
    );

    if (onGoing) {
        return await next();
    } else {
        return ctx.render('error', { error: 'Applications ended' });
    }
}
