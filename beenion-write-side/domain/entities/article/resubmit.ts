import { ArticleEvent, User, Newsletter, Article, Timestamp } from '../../types'
import { privileges } from '../../privileges'
import errors from '../../errors'

export function resubmitArticle (
  user: User,
  newsletter: Newsletter,
  article: Article,
  timestamp: Timestamp
): ArticleEvent[] {

  if (article.banned) {
    throw errors.articleAlreadyBanned()
  }

  if (article.approved) {
    throw errors.articleAlreadyApproved()
  }

  if (article.reviewProcessCompleted) {
    throw errors.reviewProcessAlreadyCompleted()
  }

  if (article.ownerId !== user.userId) {
    throw errors.userIsNotOwner()
  }

  if (!privileges.canResubmitArticle(user, newsletter)) {
    throw errors.permisionDenied()
  }

  return [
    {
      type: 'ArticleResubmitted',
      payload: {
        articleId: article.articleId,
        timestamp
      }
    }
  ]
}
