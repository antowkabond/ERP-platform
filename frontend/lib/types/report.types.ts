export * from '../api/reports';

export type ReportFormat = 'excel' | 'pdf';

export interface ReportExportOptions {
  format: ReportFormat;
  filename?: string;
}
