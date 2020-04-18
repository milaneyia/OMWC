import { ParameterizedContext } from 'koa';
import { Schedule } from '../models/Schedule';

async function getSchedule(): Promise<Schedule | undefined> {
    return await Schedule.findOne();
}

function hasApplicationsStarted(schedule: Schedule): boolean {
    return (new Date() >= new Date(schedule.applicationsStartedAt));
}

function hasApplicationsEnded(schedule: Schedule): boolean {
    return (schedule.applicationsEndedAt && new Date() >= new Date(schedule.applicationsEndedAt));
}

export async function onGoingApplications(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    const schedule = await getSchedule();

    if (!schedule) {
        return ctx.render('error');
    }

    const hasStarted = hasApplicationsStarted(schedule);
    const hasEnded = hasApplicationsEnded(schedule);

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

export async function onGoingCaptainVoting(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    const schedule = await getSchedule();

    if (!schedule) {
        return ctx.render('error');
    }

    const hasStarted = (schedule.captainVotingStartedAt && new Date() >= new Date(schedule.captainVotingStartedAt));
    const hasEnded = (schedule.captainVotingEndedAt && new Date() >= new Date(schedule.captainVotingEndedAt));

    const onGoing = (
        hasStarted &&
        !hasEnded
    );

    if (onGoing) {
        return await next();
    } else {
        return ctx.render('error', { error: `It's not the time for captain voting` });
    }
}

export async function onGoingMappersChoice(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    const schedule = await getSchedule();

    if (!schedule) {
        return ctx.render('error');
    }

    const hasStarted = (schedule.mappersChoiceStartedAt && new Date() >= new Date(schedule.mappersChoiceStartedAt));
    const hasEnded = (schedule.mappersChoiceEndedAt && new Date() >= new Date(schedule.mappersChoiceEndedAt));

    const onGoing = (
        hasStarted &&
        !hasEnded
    );

    if (onGoing) {
        return await next();
    } else {
        return ctx.render('error', { error: `It's not the time for mappers choice` });
    }
}

export async function onGoingContest(ctx: ParameterizedContext, next: () => Promise<any>): Promise<any> {
    const schedule = await getSchedule();

    if (!schedule) {
        return ctx.render('error');
    }

    const hasStarted = (schedule.constestStartedAt && new Date() >= new Date(schedule.constestStartedAt));
    const hasEnded = (schedule.constestEndedAt && new Date() >= new Date(schedule.constestEndedAt));

    const onGoing = (
        hasStarted &&
        !hasEnded
    );

    if (onGoing) {
        return await next();
    } else {
        return ctx.render('error', { error: `Contest hasn't started yet` });
    }
}
