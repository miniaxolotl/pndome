<div align="center">

<h1> <strong>pndome</strong> </h1>

**A private file hosting service with a clean and simple user interface, and user access controls.**

<!-- <img src="res/repo/banner.svg" height='300px'> -->

| build                                                                                                                   | issues                                                                                                                        | pull requests                                                                                                                          | license                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [![Build Status](https://travis-ci.com/theluckyegg/pndome.svg?branch=master)](https://travis-ci.com/theluckyegg/pndome) | [![GitHub Issues](https://img.shields.io/github/issues/theluckyegg/pndome.svg)](https://github.com/theluckyegg/pndome/issues) | [![GitHub Pull Requests](https://img.shields.io/github/issues-pr/theluckyegg/pndome.svg)](https://github.com/theluckyegg/pndome/pulls) | [![GitHub License](https://img.shields.io/github/license/theluckyegg/pndome)](/LICENSE) |

</div>

## Getting Started

### Installing

```bash
# install all dependencies
yarn install

# apply migrations to database
yarn prisma migrate dev --name init

# generate prisma models
yarn prisma generate # yarn add @prisma/client

# seed database
yarn prisma db seed # yarn prisma migrate reset
```

### Running

```
TODO
```

### Testing

```
TODO
```

## Development

### Start Services and Database

```bash
TODO
```

### Start Back-end and Front-end

```bash
#back-end
yarn serve
```

## Documentation

Software specifications & design documents can be found in the [wiki](/wiki).

## See Also

- **[legacy] pndo.me-server - https://github.com/theluckyegg/pndo.me-server**
- **[legacy] pndo.me-web - https://github.com/theluckyegg/pndo.me-web**

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for a in depth view.

## Credits

Please see [CREDITS.md](CREDITS.md) for a in depth view.

## License

This project is licensed under the **GPL-3.0** License - see the [LICENSE.md](LICENSE.md) file for details.
