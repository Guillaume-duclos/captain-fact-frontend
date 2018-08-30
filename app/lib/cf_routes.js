export const videoURL = videoHashID => `/videos/${videoHashID}`

export const videoHistoryURL = videoHashID => `${videoURL(videoHashID)}/history`

export const statementURL = (videoHashID, statementID) => `${videoURL(videoHashID)}?statement=${statementID}`

export const speakerURL = speakerIDOrSlug => `/s/${speakerIDOrSlug}`