{{- define "journey-hub.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "journey-hub.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "journey-hub.name" .) | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "journey-hub.labels" -}}
app.kubernetes.io/name: {{ include "journey-hub.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}
