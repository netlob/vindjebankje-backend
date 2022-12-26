import { Injectable } from '@nestjs/common';
import { ElasticService, Index } from '../elastic/elastic.service';
import { BenchBoxQueryDto, BenchRangeQueryDto } from './dto/bench-query.dto';

@Injectable()
export class BenchesService {
  constructor(private readonly elastic: ElasticService) {}

  async rangeQuery(query: BenchRangeQueryDto) {
    const res = await this.elastic.search({
      index: Index.BENCH,
      size: 1000,
      track_total_hits: true,
      query: {
        bool: {
          filter: {
            geo_distance: {
              distance: '5km',
              location: { lat: query.lat, lon: query.lon },
            },
          },
        },
      },
      sort: {
        // @ts-ignore
        _geo_distance: {
          location: [query.lon, query.lat],
          order: 'asc',
          unit: 'm',
          mode: 'min',
          distance_type: 'arc',
          ignore_unmapped: true,
        },
      },
    });

    const benches = res.hits.hits as unknown as [
      {
        _source: { id: string; location: { lon: number; lat: number } };
      },
    ];

    const geojson = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: 'benches',
        },
      },
      features: [],
    };

    benches.forEach(
      (bench: {
        _source: {
          id: string;
          name: string;
          tags: any;
          location: { lon: number; lat: number };
        };
      }) => {
        geojson.features.push({
          type: 'Feature',
          properties: {
            id: bench._source.id,
            name: bench._source.name,
            tags: bench._source.tags,
          },
          geometry: {
            type: 'Point',
            coordinates: [
              bench._source.location.lon,
              bench._source.location.lat,
              0.0,
            ],
          },
        });
      },
    );

    return geojson;
  }

  async boxQuery(query: BenchBoxQueryDto) {
    const res = await this.elastic.search({
      index: Index.BENCH,
      size: 1000,
      track_total_hits: true,
      query: {
        bool: {
          filter: {
            geo_bounding_box: {
              location: {
                top_right: {
                  lat: query.lat1,
                  lon: query.lon1,
                },
                bottom_left: {
                  lat: query.lat2,
                  lon: query.lon2,
                },
              },
            },
          },
        },
      },
      sort: {
        // @ts-ignore
        _geo_distance: {
          location: [
            (query.lon1 + query.lon2) / 2,
            (query.lat1 + query.lat2) / 2,
          ],
          order: 'asc',
          unit: 'm',
          mode: 'min',
          distance_type: 'arc',
          ignore_unmapped: true,
        },
      },
    });

    const benches = res.hits.hits as unknown as [
      {
        _source: {
          id: string;
          name: string;
          tags: any;
          location: { lon: number; lat: number };
        };
      },
    ];

    return benches.map((bench) => {
      return {
        id: bench._source.id,
        name: bench._source.name,
        location: [bench._source.location.lat, bench._source.location.lon],
        tags: bench._source.tags,
      };
    });
  }
}
