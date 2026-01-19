import * as WPP from '@wppconnect/wa-js';

declare global {
  interface Window {
    WPP: typeof WPP;
  }
}