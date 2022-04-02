
import * as path from "path";
import * as fs from 'fs';
import * as util from "util";
import { strict as assert } from 'assert';
import * as jsyaml from 'js-yaml';
import { Validator } from "jsonschema";
import Ajv from "ajv";


describe("YAML Tests", () => {

    function getPipeline(filename: string): any {
        var filename = path.join(__dirname, 'yaml', filename);
        var contents = fs.readFileSync(filename, 'utf8');
        var data = jsyaml.load(contents);
        return data;
    }

    function getSchema(): any {
        var schemaFilename = path.join(__dirname, 'yaml', 'schemas', 'ado-pipeline-schema.json');
        var schemaData = fs.readFileSync(schemaFilename, 'utf8');
        var schema = JSON.parse(schemaData);
        return schema;
    }

    it('Parse YAML', () => {
        const pipeline = getPipeline('azure-pipeline-test.yml');
        console.log(util.inspect(pipeline, false, 10, true));
        var yaml = util.inspect(pipeline, false, 10, false);

        console.log(JSON.stringify(pipeline));

        assert.ok(yaml);
    });

    it('ajv - Validate schema OK', () => {

        var validator = new Ajv({
            verbose: true,
            strict: false,
            allErrors: true
        });

        const schema = getSchema();
        var validateSchema = validator.validateSchema(schema);
        assert.equal(true, validateSchema);
    });

    it('ajv - Validate parsed YAML OK', () => {

        var validator = new Ajv({
            verbose: true,
            strict: false,
            allErrors: false
        });

        const schema = getSchema();
        validator.addSchema(schema, schema["$id"]);

        const pipeline = getPipeline('azure-pipeline.yml');
        console.log(JSON.stringify(pipeline));

        var validate;
        try {
            validate = validator.validate(schema, pipeline);
        } catch (error) {
            console.error(`ERROR : ${error.message}`);
            throw error;

        }

        if (validate) {
            console.log("OK");
            console.log(pipeline);
        } else {
            console.log(validator.errorsText(validator.errors));
        }
        assert.equal(true, validate);
    });

    it.skip('jsonschema - Validate parsed YAML OK', () => {
        const schema = getSchema();
        const validator = new Validator();
        //validator.addSchema(schema);

        const pipeline = getPipeline('azure-pipeline-test.yml');

        var validations = validator.validate(pipeline, schema);

        if (validations.valid) {
            console.log("OK");
            console.log(pipeline);
        } else {
            console.log(validations.errors);
        }
        assert.equal(true, validations.valid);
    });


    it.skip('jsonschema - Validate parsed YAML NOK', () => {
        const schema = getSchema();
        const validator = new Validator();

        const pipeline = getPipeline('azure-pipeline-nok.yml');
        //console.log(util.inspect(data, false, 10, true));

        var validations = validator.validate(pipeline, schema);

        if (validations.valid) {
            console.log("OK");
            console.log(pipeline);
        } else {
            console.log(validations.errors);
        }
    });

});