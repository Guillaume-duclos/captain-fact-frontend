import React, {Fragment} from 'react'
import { connect } from 'react-redux'
import { Trans, withNamespaces } from 'react-i18next'
import { isLoadingVideoDebate } from '../../state/video_debate/selectors'

import VideoDebateHistory from './VideoDebateHistory'
import ActionBubbleMenu from './ActionBubbleMenu'
import StatementsList from '../Statements/StatementsList'
import { LoadingFrame } from '../Utils/LoadingFrame'
import { hasStatementForm } from '../../state/video_debate/statements/selectors'
import { Icon } from '../Utils/Icon'
import { isAuthenticated } from '../../state/users/current_user/selectors'
import classNames from "classnames"
import {Link} from "react-router"
import {videoHistoryURL, videoURL} from "../../lib/cf_routes"
import ExternalLinkNewTab from "../Utils/ExternalLinkNewTab"


@connect(state => ({
  isLoading: isLoadingVideoDebate(state),
  hasStatements: state.VideoDebate.statements.data.size !== 0,
  hasSpeakers: state.VideoDebate.video.data.speakers.size !== 0,
  hasStatementForm: hasStatementForm(state),
  authenticated: isAuthenticated(state)
}))
@withNamespaces('videoDebate')
export class ColumnDebate extends React.PureComponent {
  render() {
    return <div id="col-debate" className="column">{this.renderContent()}</div>
  }

  renderContent() {
    const { video, isLoading, view, videoId, hasStatements, t } = this.props
    const isDebate = view === 'debate'

    if (view === 'history')
      return <VideoDebateHistory videoId={videoId} />
    if (view === 'debate') {
      if (isLoading)
        return <LoadingFrame title={this.props.t('loading.statements')} />
      return (
        <Fragment>
          <div className="tabs debate-menu is-toggle is-fullwidth">
            <ul>
              <li className={classNames({ 'is-active': isDebate })}>
                <Link to={videoURL(videoId)}>
                  <Icon size="small" name="check-circle" />
                  <span>{t('debate')}</span>
                </Link>
              </li>
              <li className={classNames({ 'is-active': !isDebate })}>
                <Link to={videoHistoryURL(videoId)}>
                  <Icon size="small" name="history" />
                  <span>{t('history')}</span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="statements-list-container">
            {!hasStatements && !this.props.hasStatementForm ? this.renderHelp() : <StatementsList />}
            <ActionBubbleMenu />
          </div>
        </Fragment>
      )
    }
  }

  renderHelp() {
    const { hasSpeakers, authenticated, t } = this.props
    let helpMessage = ''
    if (!authenticated)
      helpMessage = t('tips.noContentUnauthenticated')
    else if (!hasSpeakers)
      helpMessage = t('tips.firstSpeaker')
    else
      helpMessage = (
        <Trans i18nKey="tips.firstStatement" parent="span">
          [Now] <strong>[add]</strong> [click] <Icon name="commenting-o" />&nbsp;[icon]
        </Trans>
      )

    return (
      <div className="video-debate-help">
        <article className="message is-info">
          <div className="message-body">
            <Icon name="info-circle" />&nbsp;{helpMessage}
          </div>
        </article>
      </div>
    )
  }
}
