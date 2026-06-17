import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  search(@Query('q') q: string) {
    if (!q || q.trim().length < 1) return { tasks: [], projects: [] };
    return this.searchService.search(q.trim());
  }
}
