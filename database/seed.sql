INSERT INTO `role` (`id`, `name`) 
VALUES 
    (1, 'Basic User'),
    (2, 'Elevated User'),
    (3, 'Restricted'),
    (4, 'Contestant'),
    (5, 'Captain'),
    (6, 'Judge'),
    (7, 'Staff');

INSERT INTO `criteria` (`name`, `maxScore`)
VALUES
    ('Expertise', 30),
    ('Cohesion', 30),
    ('Creativity', 30),
    ('Judge Impression', 10);


/** Dummy data **/
INSERT INTO `country` 
VALUES
    (1,'Chile','CL',1,NULL),
    (2,'France','FR',1,NULL),
    (3,'United States','US',1,NULL),
    (4,'China','CN',1,NULL),
    (5,'Poland','PL',1,NULL),
    (6,'Sweden','SE',1,NULL),
    (7,'South Korea','KR',1,NULL),
    (8,'Australia','AU',1,NULL);

INSERT INTO `user` (`id`, `osuId`, `username`, `roleId`, `countryId`)
VALUES
    (1,1052994,'Milan-',7, 1),
    (2,6100837,'Imakuri',5, 1),
    (3,3178418,'pishifat',4, 1),
    (4,6399568,'YokesPai',5, 2),
    (5,9648246,'delusional',4, 2),
    (6,5428909,'DTM9 Nowa',4, 2),
    (7,1997633,'Riana',5, 3),
    (8,2916414,'-PC',4, 3),
    (9,6491613,'-Tatsuo',4, 3),
    (10,9070739,'Phynta',5, 4),
    (11,3868653,'waefwerf',4, 4),
    (12,4150829,'Arbane',4, 4),
    (13,2850983,'Pachiru',5, 5),
    (14,9910665,'Matissse',4, 5),
    (15,2716981,'Nozhomi',4, 5),
    (16,3076909,'Mafumafu',5, 6),
    (17,5999631,'Venix',4, 6),
    (18,10234218,'Chai the Tea',4, 6),
    (19,1943309,'Acyl',5, 7),
    (20,4525153,'xLolicore-',4, 7),
    (21,8406396,'Yudragen',4, 7),
    (22,5918561,'J1_',5, 8),
    (23,918297,'Realazy',4, 8),
    (24,4600383,'Nakano Itsuki',4, 8),
    (25,689997,'captin1',4, 1),
    (26,5745865,'Altai',4, 1),
    (27,2204515,'Mao',2, 1),
    (28,2628870,'Chaos',4, 2),
    (29,10520912,'Teky',2, 2),
    (30,9155377,'hypercyte',4, 3),
    (31,4966334,'DeviousPanda',2, 3),
    (32,2688103,'IOException',4, 4),
    (33,12882468,'jasontime12345',4, 4),
    (34,9828042,'Yooh',6, 5),
    (35,9131844,'AYE1337',6, 5),
    (36,7458583,'Frakturehawkens',6, 6),
    (37,6642617,'Serizawa Haruki',6, 6),
    (38,3723742,'Pennek',6, 7);

INSERT INTO `schedule` (`id`, `applicationsStartedAt`, `applicationsEndedAt`, `captainVotingStartedAt`, `captainVotingEndedAt`, `mappersChoiceStartedAt`, `mappersChoiceEndedAt`) 
VALUES (1, '2020-05-01', '2020-05-08', '2020-05-01', '2020-05-20', '2020-05-01', '2020-06-23');


/** Qualifiers **/
INSERT INTO `round` (`id`, `title`, `submissionsStartedAt`, `submissionsEndedAt`, `judgingStartedAt`, `judgingEndedAt`, `resultsAt`, `isQualifier`) 
VALUES (1, 'Qualifers', '2020-05-08', '2020-05-29', '2020-05-08', '2020-05-29', '2020-05-08', 1);

INSERT INTO `match` (`id`, `roundId`, `teamAId`, `teamBId`) 
VALUES (1, 1, NULL, NULL);

INSERT INTO `submission` (`originalLink`, `anonymisedAs`, `anonymisedLink`, `countryId`, `matchId`) 
(
    SELECT 'some link', NULL, NULL, `country`.`id`, `match`.`id` 
    FROM `country`, `match`
    INNER JOIN `round` ON `round`.`id` = `match`.`roundId`
    WHERE 
        `country`.`wasConfirmed` = 1 AND
        `round`.`isQualifier` = 1
);

INSERT INTO `qualifier_judging` (`judgeId`, `submissionId`) 
(SELECT `user`.`id`, `submission`.`id` FROM `user`, `submission` WHERE `user`.`roleId` = 6);

INSERT INTO `qualifier_judging_to_criteria` (`score`, `comment`, `qualifierJudgingId`, `criteriaId`)
(SELECT FLOOR(RAND() * `criteria`.`maxScore`), 'Some comment', `qualifier_judging`.`id`, `criteria`.`id` FROM `qualifier_judging`, `criteria`);


/** Elimination **/
INSERT INTO `round` (`id`, `title`, `submissionsStartedAt`, `submissionsEndedAt`, `judgingStartedAt`, `judgingEndedAt`, `resultsAt`, `isQualifier`) 
VALUES 
    (2, 'Round of 16', '2020-05-08', '2020-05-29', '2020-05-08', '2020-05-29', '2020-05-08', 0),
    (3, 'Quarter finals', '2020-05-08', '2020-05-29', '2020-05-08', '2020-05-29', '2020-05-08', 0),
    (4, 'Semi finals', '2020-05-08', '2020-05-29', '2020-05-08', '2020-05-29', '2020-05-08', 0),
    (5, 'Finals', '2020-05-08', '2020-05-29', '2020-05-08', '2020-05-29', '2020-05-08', 0);

INSERT INTO `match` (`roundId`, `teamAId`, `teamBId`) 
VALUES
    (2, 1, 8),
    (2, 2, 7),
    (2, 3, 6),
    (2, 4, 5),
    (2, 1, 8),
    (2, 2, 7),
    (2, 3, 6),
    (2, 4, 5);

INSERT INTO `match` (`roundId`, `teamAId`, `teamBId`) 
VALUES
    (3, NULL, NULL),
    (3, NULL, NULL),
    (3, NULL, NULL),
    (3, NULL, NULL),
    (4, NULL, NULL),
    (4, NULL, NULL),
    (5, NULL, NULL),
    (5, NULL, NULL);

INSERT INTO `submission` (`originalLink`, `anonymisedAs`, `anonymisedLink`, `countryId`, `matchId`) 
(
    SELECT 'some link', NULL, NULL, `country`.`id`, `match`.`id`
    FROM `country`, `match`
    INNER JOIN `round` ON `round`.`id` = `match`.`roundId`
    WHERE
        `country`.`wasConfirmed` = 1 AND
        `round`.`isQualifier` = 0 AND
        `match`.`teamAId` IS NOT NULL AND
        `match`.`teamBId` IS NOT NULL AND
        (
            `country`.`id` = `match`.`teamAId` OR
            `country`.`id` = `match`.`teamBId`
        )
);

INSERT INTO `elimination_judging` (`comment`, `judgeId`, `matchId`, `submissionChosenId`)
(
    SELECT 'Some comment', `user`.`id`, `match`.`id`, `submission`.`id`
    FROM `user`, `match`
    INNER JOIN `round` ON `round`.`id` = `match`.`roundId`
    INNER JOIN `submission` ON `submission`.`countryId` = `match`.`teamAId` AND `submission`.`matchId` = `match`.`id`
    WHERE
        `user`.`roleId` = 6 AND
        `round`.`isQualifier` = 0
);
