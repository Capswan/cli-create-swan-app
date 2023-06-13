const Generator = require('yeoman-generator')
const { execSync } = require('child_process')

module.exports = class extends Generator {
  async prompting() {
    this.props = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the project name:',
        default: "new-cs-app",
      },
      {
        type: 'input',
        name: 'description',
        message: 'Enter the project description:',
        default: "",
      },
      {
        type: 'confirm',
        name: 'flowbite',
        message: 'Would you like to include flowbite?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'jsdoc',
        message: 'Would you like to include JSDoc?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'tailwind',
        message: 'Would you like to include Tailwind?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'mdx',
        message: 'Would you like to include MDX?',
        default: false,
      },
      {
        type: 'confirm',
        name: 'strapi',
        message: 'Would you like to include Strapi?',
        default: false,
      },
    ])
  }

  install() {
    const { name, flowbite, jsdoc, mdx, tailwind, description, strapi } = this.props

    const namePath = (strapi) ? (name + '/' + name) : name
    if (strapi) {
      execSync(`mkdir -p ./${namePath}`)
    } else {
      execSync(`mkdir ${name}`)
    }

    this.fs.copyTpl(
      this.templatePath('next-template'),
      this.destinationPath(namePath),
      { name, description }
    )

    if (tailwind) {
      this.fs.copy(
        this.templatePath('tailwind/tailwind.config.js'),
        this.destinationPath(`${namePath}/tailwind.config.js`),
      )

      this.fs.copy(
        this.templatePath('tailwind/postcss.config.js'),
        this.destinationPath(`${namePath}/postcss.config.js`),
      )

      this.fs.delete(this.destinationPath(`${namePath}/package.json`))
      this.fs.copyTpl(
        this.templatePath('tailwind/package.json'),
        this.destinationPath(`${namePath}/package.json`),
        { name, description }
      )

      this.fs.delete(this.destinationPath(`${namePath}/src/app/globals.css`))
      this.fs.copyTpl(
        this.templatePath('tailwind/globals.css'),
        this.destinationPath(`${namePath}/src/app/globals.css`),
        { name }
      )

      this.fs.delete(this.destinationPath(`${namePath}/src/app/page.js`))

      this.fs.copy(
        this.templatePath('tailwind/page.js'),
        this.destinationPath(`${namePath}/src/app/page.js`),
      )

      this.fs.delete(this.destinationPath(`${namePath}/src/app/page.module.css`))
    }

    if (jsdoc) {
      const pkgJson = {
        devDependencies: {
          "jsdoc": "^4.0.2"
        },
      }

      this.fs.extendJSON(this.destinationPath(`${namePath}/package.json`), pkgJson);
    }

    if (flowbite) {
      const pkgJson = {
        devDependencies: {
          "flowbite": "^1.6.5",
        },
      }
      this.fs.extendJSON(this.destinationPath(`${namePath}/package.json`), pkgJson);
      this.fs.delete(this.destinationPath(`${namePath}/tailwind.config.js`))

      this.fs.copy(
        this.templatePath('flowbite/tailwind.config.js'),
        this.destinationPath(`${namePath}/tailwind.config.js`),
      )
    }

    if (mdx) {
      const pkgJson = {
        dependencies: {
          "@mdx-js/loader": "^2.3.0",
          "@mdx-js/react": "^2.3.0",
          "@next/mdx": "^13.4.4",
        },
      }

      this.fs.extendJSON(this.destinationPath(`${namePath}/package.json`), pkgJson);
      this.fs.delete(this.destinationPath(`${namePath}/next.config.js`))

      this.fs.copy(
        this.templatePath('mdx/mdx-components.js'),
        this.destinationPath(`${namePath}/mdx-components.js`),
      )

      this.fs.copy(
        this.templatePath('mdx/next.config.js'),
        this.destinationPath(`${namePath}/next.config.js`),
      )

      this.fs.copyTpl(
        this.templatePath('mdx/example'),
        this.destinationPath(`${namePath}/src/app/example/`),
      )
    }

    if (strapi) {
      this.fs.copy(
        this.templatePath('strapi/docker-compose.yaml'),
        this.destinationPath(`${name}/docker-compose.yaml`),
      )

    }
  }

  end() {
    this.log('Next.js project generated successfully!')
  }
}
