import { inlineCode, TimestampStyles, userMention } from 'discord.js';
import { FeedbackStatus } from '../lib/enums';
import { timeFormat } from '../lib/utils/time-format.util';

export default {
  global: {
    noPermission: "Tu n'as pas la permission de faire cela :confused:",
    wrongUserInteractionReply: 'Tu ne peux pas cliquer sur ces boutons, ils sont réservés à {user}.',
  },
  feedback: {
    embed: {
      title: '#{feedbackId} — {member.displayName}',
      defaultDescription: "Ton retour a bien été pris en compte, il sera analysé par un membre de l'équipe très bientôt.",
      urlTitle: 'Lien vers la fonctionnalité',

      rejectFieldTitle: `:x: Rejeté par {member.displayName} le ${timeFormat('{date}', TimestampStyles.LongDateTime)}`,
      updateFieldTitle: `:information_source: Mis à jour par {member.displayName} le ${timeFormat('{date}', TimestampStyles.LongDateTime)}`,
      acceptFieldTitle: `:green_heart: Accepté par {member.displayName} le ${timeFormat('{date}', TimestampStyles.LongDateTime)}`,
      dropFieldTitle: `:no_entry_sign: Marqué comme abandonné par {member.displayName} le ${timeFormat('{date}', TimestampStyles.LongDateTime)}`,
      implementFieldTitle: `:white_check_mark: Marqué comme implémenté par {member.displayName} le ${timeFormat('{date}', TimestampStyles.LongDateTime)}`,

      acceptFieldReason: 'Accepté',
      implementFieldReason: 'Implémenté',

      pointsEarned: '+{points} points, total : {total}',
    },
    buttons: {
      reject: 'Rejeter',
      update: 'Détails',
      accept: 'Accepter',
      drop: 'Abandonné',
      implement: 'Implémenté',
    },
    modal: {
      reasonLabel: 'Raison',
      reasonPlaceholder: "Raison de l'action...",
      pointsLabel: 'Points de récompense',
      pointsPlaceholder: 'Points de récompense octroyés...',
      linkLabel: 'Lien',
      linkPlaceholder: 'Lien vers le commit/la PR/la fonctionnalité...',
    },
    replies: {
      reject: 'Ce feedback a bien été rejeté.',
      update: 'Ce feedback a bien été mis à jour.',
      accept: 'Ce feedback a bien été accepté.',
      drop: 'Ce feedback a bien été abandonné.',
      implement: 'Ce feedback a bien été implémenté.',
      notFound: "Ce feedback n'a pas été trouvé.",
    },
  },
  channelsCommand: {
    description: 'Configure les salons de feedback.',
    params: {
      channel: 'Salon de feedback à ajouter.',
    },
    add: {
      description: 'Ajoute un ou plusieurs salon(s) de feedback.',
      success: 'Ces salons sont désormais des salons de feedback !',
    },
    show: {
      description: 'Voir les salons de feedback configurés.',
      none: `Aucun salon n'a été configuré pour cette guilde. Utilisez ${inlineCode('/config add <salon>')} pour ajouter un ou des salon(s).`,
      list: 'Les salons configurés pour les feedbacks sont : {channels}',
    },
    remove: {
      description: 'Enlève un ou plusieurs salon(s) de feedback.',
      none: "Aucun de ces salons n'était configuré pour les feedbacks.",
      success: 'Ces salons ne sont désormais plus des salons de feeback !',
    },
  },
  pointsCommand: {
    description: 'Voir les points de feedback.',
    params: {
      user: 'Personne visée.',
    },
    selfPoints: 'Tu as **{points} points** de feedback. Tu es **{rank}{suffix}** du serveur !',
    someonesPoints: `${userMention('{user}')} a **{points} points** de feedback et est **{rank}{suffix}** du serveur !`,
    selfNoPoints: "Tu n'as **aucun point** de feedback. Utilise <https://okampus.fr> et partage tes retours dans les salons de feedback pour en gagner !",
    someonesNoPoints: `${userMention('{user}')} n'a **aucun point** de feedback.`,
  },
  managePointsCommand: {
    description: 'Gérer les points de feedback.',
    params: {
      user: 'Personne visée.',
      amount: 'Nombre de points à modifier.',
    },
    add: {
      description: 'Ajouter des points à un utilisateur.',
      success: `**{amount} points** ont bien été ajoutés à ${userMention('{userId}')} ! Il a désormais **{points} points**.`,
    },
    remove: {
      description: 'Enlèver des points à un utilisateur.',
      success: `**{amount} points** ont bien été enlevés à ${userMention('{userId}')} ! Il a désormais **{points} points**.`,
    },
    set: {
      description: "Définir le nombre de points d'un utilisateur.",
      success: `Le nombre de points de ${userMention('{userId}')} a bien été défini à **{points} points** !`,
    },
    show: {
      description: "Voir le nombre de points d'un utilisateur.",
      noPoints: `${userMention('{userId}')} n'a **aucun points**.`,
      userPoints: `${userMention('{userId}')} a **{points} points**.`,
    },
  },
  issuesCommand: {
    description: 'Voir les retours encore en attente de réponse.',
    params: {
      channelDescription: 'Salon duquel récupérer les retours à afficher.',
      statusDescription: 'Statut des retours à afficher.',
      statusChoices: {
        [FeedbackStatus.Rejected]: '❌ Retours rejetés',
        [FeedbackStatus.Accepted]: '💚 Retours acceptés',
        [FeedbackStatus.Pending]: '⏳ Retours en attente',
        [FeedbackStatus.Dropped]: '⛔️ Retours abandonnés',
        [FeedbackStatus.Implemented]: '✅ Retours implémentés',
        waiting: '🤔 Retours en attente ou acceptés',
        all: '🔍 Tous les retours',
      },
    },
    embed: {
      titles: {
        [FeedbackStatus.Rejected]: 'Retours rejetés ({count})',
        [FeedbackStatus.Accepted]: 'Retours acceptés ({count})',
        [FeedbackStatus.Pending]: 'Retours en attente ({count})',
        [FeedbackStatus.Dropped]: 'Retours abandonnés ({count})',
        [FeedbackStatus.Implemented]: 'Retours implémentés ({count})',
        waiting: 'Retours en attente ou acceptés ({count})',
        all: 'Tous les retours ({count})',
      },
      listItem: `[[{feedbackId}] par ${userMention('{authorId}')} - ${timeFormat('{createdAt}')}]({url})`,
    },
    noFeedbackFound: 'Aucun retour trouvé.',
  },
  leaderboardCommand: {
    description: 'Voir le classement des points.',
    leaderboardTitle: 'Classement des points de feedback',
    leaderboardLine: `{rank}. ${userMention('{user}')} — {points} points`,
  },
} as const;
