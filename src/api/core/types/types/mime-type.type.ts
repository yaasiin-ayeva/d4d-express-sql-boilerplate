import { ArchiveMimeType } from "./archive-mime-type.type";
import { AudioMimeType } from "./audio-mime-type.type";
import { DocumentMimeType } from "./document-mime-type.type";
import { ImageMimeType } from "./image-mime-type.type";
import { VideoMimeType } from "./video-mime-type.type";

/**
 * @description Shortcut for all mime-types
 */
export type MimeType = AudioMimeType | ArchiveMimeType | DocumentMimeType | ImageMimeType | VideoMimeType;