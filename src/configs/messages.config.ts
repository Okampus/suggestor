import { inlineCode, TimestampStyles, userMention } from '@discordjs/builders';
import { timeFormat } from '../lib/utils';

export default {
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
      update: 'Update',
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
  },
  leaderboardCommand: {
    description: 'Voir le classement des points.',
    leaderboardTitle: 'Classement des points de feedback',
    leaderboardLine: `{rank}. ${userMention('{user}')} — {points} points`,
  },
} as const;
