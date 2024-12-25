import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Picture {
  @ApiPropertyOptional()
  url: string;
}
export class User {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  picture: Picture;
}
export class File {
  @ApiProperty()
  URL: string;
  @ApiProperty()
  NAME: string;
}
export class Message {
  @ApiProperty()
  id: string;
  @ApiProperty()
  text: string;
  @ApiProperty()
  date: number;
  @ApiPropertyOptional()
  files?: File[];
}
export class Chat {
  @ApiProperty()
  id: number;
}
