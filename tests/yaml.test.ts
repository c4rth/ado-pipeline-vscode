
import * as path from "path";
import * as fs from 'fs';
import * as util from "util";
import { strict as assert } from 'assert';
import Ajv from "ajv";
import * as jsyaml from 'js-yaml';

describe("YAML Tests", () => {

    it('Parse YAML', () => {
        var filename = path.join(__dirname, 'yaml', 'azure-pipeline.yml');
        var contents = fs.readFileSync(filename, 'utf8');
        var data = jsyaml.load(contents);
        console.log(util.inspect(data, false, 10, true));
        var yaml = util.inspect(data, false, 10, false);
        assert.ok(yaml);
    });

    it('Validate parsed YAML', () => {
        const ajv = new Ajv();
        var filename = path.join(__dirname, 'yaml', 'schemas', 'ado-pipeline-schema.yml');
        const schema = require(filename);
        const validate = ajv.compile(schema);

        var filename = path.join(__dirname, 'yaml', 'azure-pipeline.yml');
        var contents = fs.readFileSync(filename, 'utf8');
        var data = jsyaml.load(contents);
        console.log(util.inspect(data, false, 10, true));

        if (validate(data)) {
            // data is MyData here
            console.log("OK");
        } else {
            console.log(validate.errors);
        }
    });

});


/*
try {
    console.log(__dirname);
    var filename = path.join(__dirname, 'yaml', 'azure-pipeline.yml'),
        contents = fs.readFileSync(filename, 'utf8'),
        data = yaml.load(contents);
    console.log(util.inspect(data, false, 10, true));
}
catch (err: any) {
    console.log(err.stack || String(err));
}
*/